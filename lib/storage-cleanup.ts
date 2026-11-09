/**
 * Helper utility to extract and delete EdgeStore assets (cover images, inline content uploads)
 * preventing orphan files on EdgeStore when documents are permanently deleted.
 */

export function extractEdgeStoreUrls(
  content?: string,
  coverImage?: string,
): string[] {
  const urls: string[] = [];

  if (coverImage && coverImage.includes("edgestore")) {
    urls.push(coverImage);
  }

  if (content) {
    try {
      const matches = content.match(
        /https:\/\/[^\s"'`)\\]*edgestore[^\s"'`)\\]*/g,
      );
      if (matches) {
        urls.push(...matches);
      }
    } catch {
      // ignore regex parsing failure
    }
  }

  return Array.from(new Set(urls));
}

export async function deleteEdgeStoreFiles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edgestore: {
    publicFiles: { delete: (args: { url: string }) => Promise<any> };
  },
  urls: string[],
) {
  if (!urls || urls.length === 0) return;
  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        await edgestore.publicFiles.delete({ url });
      } catch {
        // file may have already been removed
      }
    }),
  );
}
