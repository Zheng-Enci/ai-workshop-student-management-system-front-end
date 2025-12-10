$old = "C:\Users\zheng\Desktop\ai-workshop-student-management-system-front-end-cbca8827bf942f46d2197ef03cc3640245160d93"
$new = "D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end"
$out = Join-Path $new "diff.md"
$maxLines = 400
$sb = New-Object System.Text.StringBuilder
function Add-Line($text) { [void]$sb.AppendLine($text) }
function RelPath($root, $item) { return $item.FullName.Substring($root.Length).TrimStart('\\') }
$oldFiles = Get-ChildItem -Path $old -Recurse -File
$newFiles = Get-ChildItem -Path $new -Recurse -File
$oldMap = @{}
$newMap = @{}
foreach ($f in $oldFiles) { $rel = RelPath $old $f; $oldMap[$rel] = $f }
foreach ($f in $newFiles) { $rel = RelPath $new $f; $newMap[$rel] = $f }
$newOnly = @(); $deleted = @(); $modified = @()
foreach ($rel in $newMap.Keys) {
    if (-not $oldMap.ContainsKey($rel)) { $newOnly += $rel }
    else {
        $oldHash = (Get-FileHash -Path $oldMap[$rel].FullName -Algorithm SHA256).Hash
        $newHash = (Get-FileHash -Path $newMap[$rel].FullName -Algorithm SHA256).Hash
        if ($oldHash -ne $newHash) { $modified += $rel }
    }
}
foreach ($rel in $oldMap.Keys) { if (-not $newMap.ContainsKey($rel)) { $deleted += $rel } }
Add-Line "# 新旧前端项目差异"
Add-Line "- 生成时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Add-Line "- 新项目: $new"
Add-Line "- 旧项目: $old"
Add-Line ""
Add-Line "## 新增文件 (${newOnly.Count})"
if ($newOnly.Count -eq 0) { Add-Line "- 无" } else { $newOnly | Sort-Object | ForEach-Object { Add-Line "- $_" } }
Add-Line ""
Add-Line "## 删除文件 (${deleted.Count})"
if ($deleted.Count -eq 0) { Add-Line "- 无" } else { $deleted | Sort-Object | ForEach-Object { Add-Line "- $_" } }
Add-Line ""
Add-Line "## 修改文件 (${modified.Count})"
if ($modified.Count -eq 0) { Add-Line "- 无" } else {
    foreach ($rel in ($modified | Sort-Object)) {
        $oldFile = $oldMap[$rel].FullName
        $newFile = $newMap[$rel].FullName
        Add-Line "### $rel"
        Add-Line "- 原文件: $oldFile"
        Add-Line "- 新文件: $newFile"
        $diffLines = & cmd /c "fc /n \"$oldFile\" \"$newFile\""
        if ($LASTEXITCODE -eq 0 -and $diffLines.Count -eq 0) {
            Add-Line "内容无变化 (可能是时间戳差异)"
        } else {
            $slice = $diffLines | Select-Object -First $maxLines
            Add-Line "```"
            foreach ($line in $slice) { Add-Line $line }
            if ($diffLines.Count -gt $maxLines) { Add-Line "... (仅展示前 $maxLines 行)" }
            Add-Line "```"
        }
        Add-Line ""
    }
}
[IO.File]::WriteAllText($out, $sb.ToString(), New-Object System.Text.UTF8Encoding($false))
