export type MediaFile = string;

export interface DriverInteface {
  getMediaFiles(url: string): Promise<MediaFile[]>;
}
