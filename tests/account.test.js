import db from "../src/core/utils/db.js";
import request from "supertest";
import bcrypt from "bcrypt";
import 'dotenv/config';


const url = `http://${process.env.HOST}:${process.env.PORT}`;


describe("Account Test", () => {

    const data = {
        fullName: "user",
        email: "user@test.com",
        passwordHash: bcrypt.hashSync("password", 10),
    }

    const user = {
        full_name: "user",
        email: "user@test.com",
        password: "password",
    }

    beforeAll(async () => {
        await db.user.deleteMany();
        await db.user.create({ data: data });
    });

    afterAll(async () => {
        await db.user.deleteMany();
        await db.$disconnect();
    });

    let token = "";
    let cookies = "";

    describe("POST /auth/login", () => {
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

            token = response.body.token;
            cookies = response.headers['set-cookie'];
        })
    });

    describe("GET /account", () => {
        it("should return 200 when get account success", async () => {
            const response = await request(url)
                .get("/account")
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("get account success");
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.email).toBe(user.email);
            expect(response.body.data.fullName).toBe(user.full_name);
        })

        it("should return 401 when unauthenticated", async () => {
            const response = await request(url)
                .get("/account")
                .send();
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Access token required");
        })
    });

    describe("PATCH /account/password", () => {
        it("should return 200 when change password success", async () => {
            const response = await request(url)
                .patch("/account/password")
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    old_password: user.password,
                    new_password: "new-password",
                    confirm_password: "new-password"
                });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("change password success");
        })
    });

    describe("DELETE /account", () => {
        it("should return 200 when delete account success", async () => {
            const response = await request(url)
                .delete("/account")
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    password: "new-password"
                });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("delete account success");
        })
    });
});