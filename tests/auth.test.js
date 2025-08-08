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

    let cookies = "";

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

    describe("POST /auth/login", () => {
        it("should return 400 when request body is invalid", async () => {
            const response = await request(url)
                .post("/auth/login")
                .send({});
            expect(response.status).toBe(400);
        })

        it("should return 401 when wrong email", async () => {
            const response = await request(url)
                .post("/auth/login")
                .send({
                    email: "wrong-email@test.com",
                    password: user.password
                });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("wrong email or password");
        })

        it("should return 401 when wrong password", async () => {
            const response = await request(url)
                .post("/auth/login")
                .send({
                    email: user.email,
                    password: "wrong-password"
                });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("wrong email or password");
        })

        it("should return 200 when login success", async () => {
            const response = await request(url)
                .post("/auth/login")
                .send({
                    email: user.email,
                    password: user.password
                });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("login success");
            expect(response.body.token).toBeDefined();

            cookies = response.headers['set-cookie'];
        })
    });

    describe("GET /auth/token", () => {
        it("should return 200 when token refreshed", async () => {
            const response = await request(url)
                .get("/auth/token")
                .set('Cookie', cookies)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("token refreshed");
            expect(response.body.token).toBeDefined();
        })

        it("should return 401 when unauthenticated", async () => {
            const response = await request(url)
                .get("/auth/token")
                .send();
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("authentication required");
        })
    });

    describe("POST /auth/logout", () => {
        it("should return 200 when logout success", async () => {
            const response = await request(url)
                .post("/auth/logout")
                .set('Cookie', cookies)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("logout success");
        })

        it("should return 401 when unauthenticated", async () => {
            const response = await request(url)
                .post("/auth/logout")
                .send();
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("unauthenticated");
        })
    });
});