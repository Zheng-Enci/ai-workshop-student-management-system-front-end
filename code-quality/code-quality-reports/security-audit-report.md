# 依赖安全审计报告

## ⚠️ 发现安全漏洞

| 严重程度 | 数量 |
|---------|------|
| 🟠 高危 | 10 |
| 🟡 中等 | 3 |
| **总计** | **13** |

## 📋 漏洞详情

### 1. ajv

- **严重程度**: moderate
- **影响范围**: ajv has ReDoS when using `$data` option, ajv has ReDoS when using `$data` option
- **修复建议**: 运行 npm audit fix

### 2. axios

- **严重程度**: high
- **影响范围**: Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig
- **修复建议**: [object Object]

### 3. brace-expansion

- **严重程度**: moderate
- **影响范围**: brace-expansion: Zero-step sequence causes process hang and memory exhaustion, brace-expansion: Zero-step sequence causes process hang and memory exhaustion
- **修复建议**: 运行 npm audit fix

### 4. eslint-plugin-sonarjs

- **严重程度**: high
- **影响范围**: minimatch
- **修复建议**: 运行 npm audit fix

### 5. flatted

- **严重程度**: high
- **影响范围**: flatted vulnerable to unbounded recursion DoS in parse() revive phase, Prototype Pollution via parse() in NodeJS flatted
- **修复建议**: 运行 npm audit fix

### 6. lodash

- **严重程度**: high
- **影响范围**: Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions, lodash vulnerable to Code Injection via `_.template` imports key names, lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`
- **修复建议**: 运行 npm audit fix

### 7. lodash-es

- **严重程度**: high
- **影响范围**: Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions, lodash vulnerable to Code Injection via `_.template` imports key names, lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`
- **修复建议**: 运行 npm audit fix

### 8. minimatch

- **严重程度**: high
- **影响范围**: minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern, minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern, minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern, minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments, minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments, minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments, minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions, minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions, minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
- **修复建议**: 运行 npm audit fix

### 9. picomatch

- **严重程度**: high
- **影响范围**: Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching, Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching, Picomatch has a ReDoS vulnerability via extglob quantifiers, Picomatch has a ReDoS vulnerability via extglob quantifiers
- **修复建议**: 运行 npm audit fix

### 10. rollup

- **严重程度**: high
- **影响范围**: Rollup 4 has Arbitrary File Write via Path Traversal, Rollup 4 has Arbitrary File Write via Path Traversal
- **修复建议**: 运行 npm audit fix

### 11. serialize-javascript

- **严重程度**: high
- **影响范围**: Serialize JavaScript is Vulnerable to RCE via RegExp.flags and Date.prototype.toISOString(), Serialize JavaScript has CPU Exhaustion Denial of Service via crafted array-like objects
- **修复建议**: 运行 npm audit fix

### 12. terser-webpack-plugin

- **严重程度**: high
- **影响范围**: serialize-javascript
- **修复建议**: 运行 npm audit fix

### 13. yaml

- **严重程度**: moderate
- **影响范围**: yaml is vulnerable to Stack Overflow via deeply nested YAML collections, yaml is vulnerable to Stack Overflow via deeply nested YAML collections
- **修复建议**: 运行 npm audit fix

## 💡 修复建议

1. 运行 `npm run check:security:fix` 尝试自动修复
2. 运行 `npm run check:security` 查看详细信息
3. 手动更新有漏洞的依赖包到安全版本

---

*报告生成时间: 2026/4/5 16:39:31*
