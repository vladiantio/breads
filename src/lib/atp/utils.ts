import { segmentize, type RichtextSegment } from "@atcute/bluesky-richtext-segmenter";
import type { AppBskyRichtextFacet } from "@atcute/bluesky";

export type RichtextFeature =
  | AppBskyRichtextFacet.Mention
  | AppBskyRichtextFacet.Link
  | AppBskyRichtextFacet.Tag;

export const segmentizeFacets = (
  text: string,
  facets?: AppBskyRichtextFacet.Main[],
): RichtextSegment<RichtextFeature>[] => segmentize(text, facets);

export const convertRichTextToPlainText = (text: string, facets?: AppBskyRichtextFacet.Main[]): string => {
  try {
    return segmentizeFacets(text, facets).map(segment => {
      const link = segment.features?.find(
        (feature): feature is AppBskyRichtextFacet.Link => feature.$type === 'app.bsky.richtext.facet#link'
      );
      if (link)
        return link.uri;
      else
        return segment.text;
    }).join('');
  } catch (error) {
    console.error('Error converting rich text to plain text:', error);
    return text;
  }
};

// source: https://github.com/bluesky-social/social-app/blob/main/src/view/com/util/UserAvatar.tsx
export const hackModifyThumbnailPath = (uri?: string, isEnabled?: boolean): string | undefined => isEnabled
  ? uri?.replace('/img/avatar/plain/', '/img/avatar_thumbnail/plain/')
  : uri;
