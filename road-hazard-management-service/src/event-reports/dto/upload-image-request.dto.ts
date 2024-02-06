import { tags } from 'typia';

export interface IUploadImageRequest {
  fileName: string & tags.MinLength<1>;
}
