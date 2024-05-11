// fileUtils.ts

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function getFileType(extension: string): string {
  switch (extension) {
    case 'doc':
    case 'docx':
      return 'word';
    case 'txt':
    case 'rtf':
    case 'md':
      return 'lines';
    case 'pdf':
      return 'pdf';

    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    case 'ppt':
    case 'pptx':
      return 'powerpoint';

    case 'zip':
    case 'rar':
      return 'zipper';
    default:
      return 'unknown';
  }
}
