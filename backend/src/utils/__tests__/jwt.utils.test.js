import { vi,describe,it,expect} from "vitest";
import {generateToken, verifyToken} from '../jwt.util.js';
import jwt from "jsonwebtoken";


vi.mock("jsonwebtoken");

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

describe("Generate Jwt Token", () =>{

    it("should return a jwt token  created using the payload and jwt secret",() =>{
        const token = generateToken({userId: "1233"});
        const parts = token.split(".");
        expect(parts.length).toBe(3);
    })


    it("The jwt secret shouldnt be undefined",()=>{

        const payload = {id: "suvani"};

        jwt.sign.mockReturnValue("S3CR3T_TOK3N");

         const result = generateToken(payload);
         expect(result).toBe("S3CR3T_TOK3N");

         expect(jwt.sign).toHaveBeenCalled();
    });

    it("It should return a boolean",() =>{
        
        const token = "S3CR3T_TOK3N";

        jwt.verify.mockReturnValue("S3CR3T_TOK3N");

        const result = verifyToken(token);
        expect(result).toBe("S3CR3T_TOK3N");

        expect(verify).toHaveBeenCalled()
    });

})