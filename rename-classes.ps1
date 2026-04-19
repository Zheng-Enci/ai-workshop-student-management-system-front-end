# 导航页桌面端类名替换脚本
# 将 camelCase 类名转换为 kebab-case

$replacements = @{
    # navSectionAdmin
    'navigation-desktop-navSectionAdmin' = 'navigation-desktop-nav-section-admin'
    # navSectionPersonal
    'navigation-desktop-navSectionPersonal' = 'navigation-desktop-nav-section-personal'
    # navSectionData
    'navigation-desktop-navSectionData' = 'navigation-desktop-nav-section-data'
    # navSectionCard
    'navigation-desktop-navSectionCard' = 'navigation-desktop-nav-section-card'
    # navSections (容器)
    'navigation-desktop-navSections' = 'navigation-desktop-nav-sections'
    # user-card
    'navigation-desktop-user-card' = 'navigation-desktop-user-card'
    # header
    'navigation-desktop-header' = 'navigation-desktop-header'
}

$files = @(
    'src/views/NavigationPage/css/desktop/navigation-desktop-navSectionAdmin.css',
    'src/views/NavigationPage/css/desktop/navigation-desktop-navSectionPersonal.css',
    'src/views/NavigationPage/css/desktop/navigation-desktop-navSectionData.css',
    'src/views/NavigationPage/css/desktop/navigation-desktop-navSectionCard.css',
    'src/views/NavigationPage/css/desktop/navigation-desktop-navSections.css',
    'src/views/NavigationPage/css/desktop/navigation-desktop-user-card.css',
    'src/views/NavigationPage/css/desktop/navigation-desktop-header.css',
    'src/views/NavigationPage/NavigationPageDesktop.vue',
    'src/views/NavigationPage/css/NavigationPage.css',
    'src/views/NavigationPage/css/NavigationPageDesktop.css'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            $content = $content -replace $old, $new
        }
        Set-Content $file $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "Done!"
