# Compilers and interpreters


## A simple lisp-interpreter
Main:
```ts
// based on https://chidiwilliams.com/post/how-to-write-a-lisp-interpreter-in-javascript/
import { Interpreter } from './interpreter';
import { Parser } from './parser';
import { Scanner } from './scanner';



const code = `
(+ 1.234 2)
`;

const tokens = new Scanner(code).scan();
const exprs = new Parser(tokens).parse();
const result = new Interpreter().interpretAll(exprs);
console.log(result);
```

Scanner:
```ts
export type TokenType = 'LeftBracket' | 'RightBracket' | 'Symbol' | 'Number' | 'Boolean' | 'String' | 'Eof';
export type Literal = number | boolean | string | undefined;

export class Token {
    constructor(readonly type: TokenType, readonly lexeme: string, readonly literal: Literal) {}
}

export class Scanner {
    private start = 0;
    private current = 0;
    private tokens: Token[] = [];

    constructor(private source: string) {}

    public scan(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;

            const char = this.advance();
            switch (char) {

                case '(':
                    this.addToken('LeftBracket');
                    break;
                
                    case ')':
                    this.addToken('RightBracket');
                    break;
                
                    case '#':
                    if (this.peek() === 't') {
                        this.advance();
                        this.addToken('Boolean', true);
                        break;
                    }
                    if (this.peek() === 'f') {
                        this.advance();
                        this.addToken('Boolean', false);
                        break;
                    }
                
                    case '"':
                    while (this.peek() !== '"' && !this.isAtEnd()) {
                        this.advance();
                    }
                    const literal = this.source.slice(this.start+1, this.current);
                    this.addToken('String', literal);
                    this.advance();
                    break;
                
                    case ' ':
                case '\r':
                case '\t':
                case '\n':
                    break;

                default:
                    if (this.isDigit(char)) {
                        while (this.isDigitOrDot(this.peek())) {
                            this.advance();
                        }
                        const nr = this.source.slice(this.start, this.current);
                        const literal = parseFloat(nr);
                        this.addToken('Number', literal);
                        break;
                    }

                    if (this.isIdentifier(char)) {
                        while (this.isIdentifier(this.peek())) {
                            this.advance();
                        }
                        this.addToken('Symbol');
                        break;
                    }

                    throw new SyntaxError(`Unknown token: ${char}`);
            }
        }
        this.addToken('Eof');

        return this.tokens;
    }

    private addToken(type: TokenType, literal?: Literal) {
        const lexeme = this.source.slice(this.start, this.current);
        this.tokens.push(new Token(type, lexeme, literal));
    }

    private advance() {
        return this.source[this.current++];
    }

    private peek() {
        return this.source[this.current];
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private isDigit(char: string) { return char >= '0' && char <= '9'; }

    private isDigitOrDot(char: string) { return this.isDigit(char) || char === '.'; }

    private isIdentifier(char: string) {
        return (
          this.isDigitOrDot(char) ||
          (char >= 'A' && char <= 'Z') ||
          (char >= 'a' && char <= 'z') ||
          ['+', '-', '.', '*', '/', '<', '=', '>', '!',
           '?', ':', '$', '%', '_', '&', '~', '^'].includes(char)
        );
      }
}
```

Parser:
```ts
import { Token, Literal, TokenType } from "./scanner";

export interface Expression {
}

export class CallExpression implements Expression {
    constructor(readonly callee: Expression, readonly args: Expression[]) {}
}

export class SymbolExpression implements Expression {
    constructor(readonly token: Token) {}
}

export class LiteralExpression implements Expression {
    constructor(readonly value: Literal) {}
}

export class IfExpression implements Expression {
    constructor(readonly test: Expression, readonly consequent: Expression, readonly alternative: Expression | undefined) {}
}

export class Parser {

    private current = 0;

    constructor(private tokens: Token[]) {}

    public parse(): Expression[] {
        const expressions: Expression[] = [];
        while (!this.isAtEnd()) {
            const expr = this.parseExpression();
            expressions.push(expr);
        }
        return expressions;
    }

    private parseExpression(): Expression {

        if (this.match('LeftBracket')) {
            if (this.match('RightBracket')) {   // <------------ ()
                return new LiteralExpression(undefined);
            }

            const token = this.peek();
            if (token.lexeme === 'if') {  // <-------- (if ....)
                return this.if();
            } else {                      // <-------- (expr ....)
                return this.call();
            }

        } else {
            return this.atom();  // <------- atom
        }
    }

    private atom() {
        switch (true) {
            case this.match('Symbol'):
                return new SymbolExpression(this.previous());
            case this.match('Number'):
            case this.match('String'):
            case this.match('Boolean'):
                return new LiteralExpression(this.previous().literal);
            default:
                throw new SyntaxError(`Unexpected token: ${this.peek().type}`);
        }
    }

    private call() {
        const callee = this.parseExpression();
        const args = [];
        while (!this.match('RightBracket')) {
            args.push(this.parseExpression());
        }
        return new CallExpression(callee, args);
    }

    private if() {
        this.advance(); 
        const test = this.parseExpression();
        const consequent = this.parseExpression();
        let alternative: Expression | undefined = undefined;
        if (!this.match('RightBracket')) {
            alternative = this.parseExpression();
        }
        this.consume('RightBracket');
        return new IfExpression(test, consequent, alternative);
    }

    private consume(type: TokenType) {
        if (this.check(type)) {
            return this.advance();
        }
        throw new SyntaxError(`Unexpected token ${this.previous().type}, expected ${type}`);
    }

    private match(type: TokenType) {
        if (this.check(type)) {
            this.current++;
            return true;
        }
        return false;
    }

    private check(type: TokenType) {
        return this.peek().type === type;
    }

    private isAtEnd() {
        return this.peek().type === 'Eof';
    }

    private peek () {
        return this.tokens[this.current];
    }

    private advance() {
        return this.tokens[this.current++];
    }

    private previous() {
        return this.tokens[this.current - 1];
    }
}
```

Interpreter:
```ts
import { CallExpression, Expression, IfExpression, LiteralExpression, SymbolExpression } from './parser';


export class Interpreter {
    private env = new Map(Object.entries({
        // @ts-ignore
        '*': ([a, b]: any[]) => a * b,
        '/': ([a, b]: any[]) => a / b,
        '+': ([a, b]: any[]) => a + b,
        '-': ([a, b]: any[]) => a - b,
        '=': ([a, b]: any[]) => a === b,
        'car': ([a]: any[]) => a[0],
        'cdr': ([a]: any[]) => a.length > 1 ? a.slice(1) : undefined,
        // @ts-ignore
        'cons': ([a, b]: any[]) => [a, ...b],
        'print': ([a]: any[]) => console.log(a)
    }));

    public interpretAll(expressions: Expression[]) {
        let result: any;
        for (const expr of expressions) {
            result = this.interpret(expr, this.env);
        }
        return result;
    }

    private interpret(expression: Expression, env: Map<string, CallableFunction>): any {
        
        if (expression instanceof LiteralExpression) {
            return expression.value;
        }

        if (expression instanceof SymbolExpression) {
            if (env.has(expression.token.lexeme)) {
                return env.get(expression.token.lexeme);
            }
            throw new Error(`Unknown identifier: ${expression.token.lexeme}`);
        }

        if (expression instanceof IfExpression) {
            const test = this.interpret(expression.test, env);
            if (test !== false) {
                return this.interpret(expression.consequent, env);
            } else {
                if (!expression.alternative) return undefined;
                return this.interpret(expression.alternative, env);
            }
        }

        if (expression instanceof CallExpression) {
            const callee = this.interpret(expression.callee, env);
            const args = expression.args.map(a => this.interpret(a, env));
            if (callee instanceof Function) {
                callee(args);
            }
            throw Error(`Cannot call: ${callee}(${args})`);
        }

        throw Error(`Unknown expression: ${expression}`);
    }
}
```

## More complex languages
Lisp is an extremely simple language.
- More complex languages will not only have expressions, but also statements (lines of code that don't evaluate to a value).
- If you do importing, you'll need to not only build an AST, but also a *symbol table*.
    - That symbol table may even persist into the final executable
    - C object files keep their symbol table so that the symbols can be resolved by a linker.
