import {vi,describe,it,expect} from "vitest";
import bcrypt from "bcrypt";
import { comparePassword } from "../comparePassword";

vi.mock("bcrypt");
describe("comparePassword", () =>{
    it ("It should compare two password and return a boolean", async() =>{
    const password = "supersecretpass"
    const hash = "fakePassword"
    
    bcrypt.compare.mockResolvedValue(true);
    
    const result = await comparePassword(password,hash);
    expect(result).toBe(true);
    
    })
})