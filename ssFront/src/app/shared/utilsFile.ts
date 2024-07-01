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

export function getMimeType(extension: string): string {
  switch (extension) {
    case 'zip':
      return 'application/zip';
      break;
    case 'pdf':
      return 'application/pdf;base64,';
      break;
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
      break;
    case 'png':
      return 'image/png';
      break;
    case 'doc':
      return 'application/msword';
      break;
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    default:
      return 'application/octet-stream';
  }
}
