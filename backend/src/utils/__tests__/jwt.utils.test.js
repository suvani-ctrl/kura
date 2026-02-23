import {describe,it,expect} from "vitest";
import {authCookieOptions,generateToken,verifyToken} from "../jwt.util.js";

describe("authCookieOptionFunction", () =>{
    it("It should have token expiry of 1 hour ", () =>{
        expect(authCookieOptions.maxAge).toBe(60 * 60 * 1000);
    });
    it("This should have secure set to false in non-production environment", () =>{
        expect(authCookieOptions.secure).toBe(false);
    });
    it("It should have http Only set to true", () =>{
        expect(authCookieOptions.httpOnly).toBe(true);
    });
    it("It should have same site to be lax since its not on production", ()=>{
        expect(authCookieOptions.sameSite).toBe("lax");
    })
})

describe("generateToken", () =>{
        it("The jwt secret should not be empty or undefined", () =>{
            const payload = {id: "123"};
            jwt.sign.mockReturnValue("fake_token_123");
            const result = generateToken(payload);
            expect(result).toBe("fake_token_123");
            expect(jwt.sign).toHaveBeenCalled();
        })
})


describe("verifyToken", () =>{

})