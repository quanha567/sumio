import { describe, expect, it, vi } from "vitest";

import { User } from "../../../domain/entities/user.entity.js";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface.js";
import { Email } from "../../../domain/value-objects/email.vo.js";
import { SyncUserUseCase } from "./sync-user.use-case.js";

describe("SyncUserUseCase (JIT Provisioning)", () => {
  it("should create and save a new user when identity does not exist", async () => {
    const mockRepo: IUserRepository = {
      findById: vi.fn().mockResolvedValue(null),
      findByFirebaseUid: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockImplementation(async () => {}),
    };

    const useCase = new SyncUserUseCase(mockRepo);
    const result = await useCase.execute({
      firebaseUid: "fb-unique-123",
      email: "newuser@example.com",
      displayName: "New User",
    });

    expect(result.email.value).toBe("newuser@example.com");
    expect(result.displayName).toBe("New User");
    expect(mockRepo.save).toHaveBeenCalledOnce();
  });

  it("should update existing user when found by firebase UID", async () => {
    const existing = User.create({
      email: Email.create("existing@example.com"),
      firebaseUid: "fb-existing-123",
      displayName: "Old Name",
    });

    const mockRepo: IUserRepository = {
      findById: vi.fn().mockResolvedValue(null),
      findByFirebaseUid: vi.fn().mockResolvedValue(existing),
      findByEmail: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockImplementation(async () => {}),
    };

    const useCase = new SyncUserUseCase(mockRepo);
    const result = await useCase.execute({
      firebaseUid: "fb-existing-123",
      email: "existing@example.com",
      displayName: "New Display Name",
    });

    expect(result.displayName).toBe("New Display Name");
    expect(mockRepo.save).toHaveBeenCalledWith(existing);
  });
});
