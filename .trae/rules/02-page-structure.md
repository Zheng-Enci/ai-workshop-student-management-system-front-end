# Page and CSS Structure Rules

## Page File Structure

- Each page must have 3 Vue files:
  1. `PageName.vue` - Main entry, handles device type routing
  2. `PageNameDesktop.vue` - Desktop page component
  3. `PageNameMobile.vue` - Mobile page component

## Form Component Structure

- Form components (like Dialog) should be placed in `forms` folder:
  - `forms/desktop/` - Desktop forms
  - `forms/mobile/` - Mobile forms
  - Form files should end with `Form`, e.g., `UpdateStudentInfoForm.vue`
- **Form styles should be written in Vue file's `<style scoped>`**, no separate CSS files
- Form CSS class names must use prefix, format: `{filename}-{original-class-name}`, e.g., `HeatmapChartForm-container`

## CSS Naming Rules

- Use BEM or kebab-case naming
- Separate mobile and desktop styles into different files
- Desktop style files add `-desktop` suffix
- Mobile style files add `-mobile` suffix
- **CSS class names must use file name prefix**: use complete file name as prefix
  - Format: `{filename}-{original-class-name}`
  - Example: `attendance-mobile-status-cards-card-mobile`
  - Benefits: namespace isolation, avoid style conflicts, traceability

## Component Code Structure

```vue
<script setup>
/** *******************************************************************
 * Component Name - Core Logic Layer
 * Function Overview:
 * 1. Feature description
 * 2. Feature description
 ********************************************************************/

// ======================== Dependency Import Section ========================
// Third-party library imports

// ======================== Component Import Section ========================
// Child component imports

// ======================== Constant Definition Section ========================
// Constant definitions

// ======================== Reactive State Section ========================
// ref/reactive definitions

// ======================== Computed Properties Section ========================
// computed definitions

// ======================== Method Definition Section ========================
// Function definitions

// ======================== Lifecycle Hooks Section ========================
// onMounted/onUnmounted etc
</script>

<template>
    <!-- Template Content -->
</template>

<style scoped>
/* Style Content */
</style>
```
