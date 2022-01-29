import ts, { CallExpression, ExpressionStatement, Identifier, StringLiteral, SyntaxKind } from 'typescript'
import fs from 'fs'

const sourceFileNode = ts.createSourceFile(
  'x.ts',   // fileName
  fs.readFileSync('./src/sample2.spec.tsx', 'utf8'), // sourceText
  ts.ScriptTarget.Latest // langugeVersion
)

sourceFileNode.forEachChild(node => {
    nodeWalker(node, 0)
})

function nodeWalker(node: ts.Node, depth: number) {
    if (isExpressionStatement(node)) {
        const callExpression = (node as ExpressionStatement).expression as CallExpression
        processExpression(callExpression, depth+1)
    }
}

function processExpression(callExpression: CallExpression, depth: number) {
    const identifier = callExpression.expression as Identifier

    const identifierName = identifier?.escapedText
    if (identifierName === 'describe' || identifierName === 'it') {
        callExpression.arguments.forEach(arg => {
            if(arg.kind === SyntaxKind.StringLiteral) {
                console.log(`${indent(depth)}${identifierName} ${(arg as StringLiteral).text}`)
            }
            if(arg.kind === SyntaxKind.ArrowFunction || arg.kind === SyntaxKind.FunctionExpression) {
                const functionNode = arg as ts.FunctionLikeDeclaration
                functionNode.body?.forEachChild(node => {
                    nodeWalker(node, depth+1)
                })
            }
        })
    }
}

function indent(depth: number) {
    let indentStr = ''
    for (let i = 0; i < depth; i++) {
        indentStr += '  '
    }
    return indentStr
}

function isExpressionStatement(node: ts.Node): boolean {
    const kind = ts.SyntaxKind[node.kind]
    if (kind === 'ExpressionStatement') {
        return true
    }
    return false
}
