import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

const mockResult = {
  token: "mocked-token-123",
  user: { email: "user@example.com", subscription: "starter" },
};

jest.unstable_mockModule("../../services/authService.js", () => ({
  loginUser: jest.fn().mockResolvedValue(mockResult),
}));

const { loginUser } = await import("../../services/authService.js");
const { login: loginController } = await import(
  "../../controllers/authControllers.js"
);
const authRouter = (await import("../../routes/authRouter.js")).default;

describe("Auth controller - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Unit: controller should call authService.loginUser and return token & user", async () => {
    const req = {
      body: { email: "user@example.com", password: "password123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginController(req, res);

    expect(loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });

    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
      user: {
        email: expect.any(String),
        subscription: expect.any(String),
      },
    });
  });

  test("POST /api/auth/login should return 200 with token and user fields", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);

    await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password123" })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toBe("string");

        expect(res.body).toHaveProperty("user");
        expect(typeof res.body.user.email).toBe("string");
        expect(typeof res.body.user.subscription).toBe("string");
      });
  });
});
