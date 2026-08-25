import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("PasswordSecurity", () => {
  it("should hash and verify valid passwords", async () => {
    const password = "superSecretPassword123!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect passwords", async () => {
    const password = "correctPassword";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword("wrongPassword", hash);
    expect(isValid).toBe(false);
  });
});
