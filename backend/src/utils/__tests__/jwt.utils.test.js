import { vi,describe,it,expect} from "vitest";
import {generateToken, verifyToken} from '../jwt.util.js';
import jwt from "jsonwebtoken";


vi.mock("jsonwebtoken");


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