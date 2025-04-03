export const removeHttpAndWww = (url: string) => url.replace(/^(?:https?:\/\/)?(?:www\.)?/, '');

export const truncateString = (str: string, maxLength: number = 30) => str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
