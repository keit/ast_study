import ts, { ExpressionStatement } from 'typescript'
import fs from 'fs'

const node = ts.createSourceFile(
  'x.ts',   // fileName
  fs.readFileSync('./src/sample1.spec.tsx', 'utf8'), // sourceText
  ts.ScriptTarget.Latest // langugeVersion
)
console.log(ts.SyntaxKind[node.kind]);
node.forEachChild(node => {
    const kind = ts.SyntaxKind[node.kind]
    console.log(kind);

    if (kind === 'ExpressionStatement') {
        const expStatement = node as ExpressionStatement;
        console.log(expStatement.expression);
    }
})
