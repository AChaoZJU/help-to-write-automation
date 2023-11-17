export const getFilesWithPrefix = (files: string[], prefix = '../../workstation-attribute-editor/tests/acceptance') => {
  return files.map((file) => {
    return `${prefix}/${file}`
  })
}
