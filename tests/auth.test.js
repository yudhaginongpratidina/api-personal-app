import db from "../src/core/utils/db.js";
import request from "supertest";
import 'dotenv/config';


const url = `http://${process.env.HOST}:${process.env.PORT}`;


describe("Authentication Test", () => {
    beforeAll(async () => {
        await db.user.deleteMany();
    });

    afterAll(async () => {
        await db.user.deleteMany();
        await db.$disconnect();
    });

    const user = {
        full_name: "user",
        email: "user@test.com",
        password: "password",
        confirm_password: "password"
    }

    describe("POST /auth/register", () => {
        it("should return 400 when request body is invalid", async () => {
            const response = await request(url)
                .post("/auth/register")
                .send({});
            expect(response.status).toBe(400);
        })

        it("should return 400 when email is invalid", async () => {
            const response = await request(url)
                .post("/auth/register")
                .send({
                    full_name: "user",
                    email: "user.com",
                    password: "password",
                    confirm_password: "password"
                });
            expect(response.status).toBe(400);
            expect(response.body.data[0].path).toBe("email");
            expect(response.body.data[0].message).toBe("invalid email");
        })

        it("should return 400 when password not match", async () => {
            const response = await request(url)
                .post("/auth/register")
                .send({
                    full_name: "user",
                    email: "user@test.com",
                    password: "password",
                    confirm_password: "password1"
                });
            expect(response.status).toBe(400);
            expect(response.body.data[0].path).toBe("confirm_password");
            expect(response.body.data[0].message).toBe("passwords do not match");
        })

        it("should return 201 when create user success", async () => {
            const response = await request(url)
                .post("/auth/register")
                .send(user);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("register success");
            expect(response.body.data.id).toBeDefined();
        })

        it("should return 409 when email already exist", async () => {
            const response = await request(url)
                .post("/auth/register")
                .send(user);
            expect(response.status).toBe(409);
            expect(response.body.message).toBe("email already exist");
        })
    });
});