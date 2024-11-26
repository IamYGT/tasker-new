/**
 * Tarihi formatlar
 * @param date ISO tarih stringi
 * @returns Formatlanmış tarih stringi
 */
export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

/**
 * Dosya boyutunu formatlar
 * @param size Bayt cinsinden boyut
 * @returns Formatlanmış boyut stringi
 */
export const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
};

/**
 * Dosya tipini kontrol eder
 * @param type MIME tipi
 * @returns boolean
 */
export const isImageFile = (type: string) => {
    return type.startsWith('image/');
};

/**
 * Dosya uzantısına göre icon seçer
 * @param type MIME tipi
 * @returns string
 */
export const getFileIcon = (type: string) => {
    if (isImageFile(type)) return 'image';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word') || type.includes('doc')) return 'word';
    if (type.includes('excel') || type.includes('sheet')) return 'excel';
    return 'file';
};

/**
 * Maksimum dosya boyutunu kontrol eder
 * @param size Bayt cinsinden boyut
 * @param maxSize Maksimum boyut (varsayılan: 10MB)
 * @returns boolean
 */
export const isValidFileSize = (size: number, maxSize: number = 10 * 1024 * 1024) => {
    return size <= maxSize;
}; 