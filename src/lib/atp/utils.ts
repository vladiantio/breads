import { Facet, RichText } from "@atproto/api";

export const convertRichTextToPlainText = (text: string, facets?: Facet[]): string => {
  try {
    const richText = new RichText({ text, facets });
    return [...richText.segments()].map(segment => {
      if (segment.isLink())
        return segment.link!.uri;
      else
        return segment.text;
    }).join('');
  } catch (error) {
    console.error('Error converting rich text to plain text:', error);
    return text;
  }
};
