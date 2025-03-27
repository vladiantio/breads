export const removeHttpAndWww = (url: string) => url.replace(/^(?:https?:\/\/)?(?:www\.)?/, '');
