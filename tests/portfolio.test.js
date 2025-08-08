import db from "../src/core/utils/db.js";
import request from "supertest";
import bcrypt from "bcrypt";
import 'dotenv/config';


const url = `http://${process.env.HOST}:${process.env.PORT}`;


describe("Portfolio Test", () => {

    const data = {
        fullName: "user",
        email: "user@test.com",
        passwordHash: bcrypt.hashSync("password", 10),
    }

    const user = {
        email: "user@test.com",
        password: "password",
    }

    const portfolio = {
        name: "portfoliio name",
        demo_url: "https://google.com",
        repo_url: "https://google.com",
        description: "portfoliodescription"
    }

    beforeAll(async () => {
        await db.portfolioImage.deleteMany();
        await db.portfolio.deleteMany();
        await db.user.deleteMany();
        await db.user.create({ data: data });
    });

    afterAll(async () => {
        await db.portfolioImage.deleteMany();
        await db.portfolio.deleteMany();
        await db.user.deleteMany();
        await db.$disconnect();
    });

    let token = "";
    let cookies = "";
    let portfolioId = "";

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

    describe("POST /portfolio", () => {
        it("should return 400 when form is invalid", async () => {
            const response = await request(url)
                .post("/portfolio")
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(400);
        })

        it("should return 201 when create portfolio success", async () => {
            const response = await request(url)
                .post("/portfolio")
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send(portfolio);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("create portfolio success");
            expect(response.body.data.id).toBeDefined();

            portfolioId = response.body.data.id;
        })
    });

    describe("GET /portfolio", () => {
        it("should return 200 when get my portfolio success", async () => {
            const response = await request(url)
                .get("/portfolio")
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("get my portfolio success");
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].id).toBeDefined();
            expect(response.body.data[0].name).toBe(portfolio.name);
            expect(response.body.data[0].demoUrl).toBe(portfolio.demo_url);
            expect(response.body.data[0].repoUrl).toBe(portfolio.repo_url);
        })
    });

    describe("GET /portfolio/:id", () => {
        it("should return 200 when get detail portfolio success", async () => {
            const response = await request(url)
                .get(`/portfolio/${portfolioId}`)
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("get detail portfolio success");
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.name).toBe(portfolio.name);
            expect(response.body.data.demoUrl).toBe(portfolio.demo_url);
            expect(response.body.data.repoUrl).toBe(portfolio.repo_url);
        })

        it("should return 404 when portfolio not found", async () => {
            const response = await request(url)
                .get(`/portfolio/123`)
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("portfolio not found");
        })
    });

    describe("PATCH /portfolio/:id", () => {
        it("should return 200 when update portfolio success", async () => {
            const response = await request(url)
                .patch(`/portfolio/${portfolioId}`)
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send(portfolio);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("update portfolio success");
        })
    });

    describe("DELETE /portfolio/:id", () => {
        it("should return 200 when delete portfolio success", async () => {
            const response = await request(url)
                .delete(`/portfolio/${portfolioId}`)
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    password: user.password
                });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("delete portfolio success");
        })

        it("should return 404 when portfolio not found", async () => {
            const response = await request(url)
                .delete(`/portfolio/123`)
                .set('Cookie', cookies)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    password: user.password
                });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("portfolio not found");
        })
    });
});