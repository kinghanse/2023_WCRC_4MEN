import { SafetyLevelEnum } from 'src/common/constants';
import { tags } from 'typia';

export interface IEvent {
  id: string & tags.Format<'uuid'>;
  source_id: string & tags.MinLength<1>;
  category: string & tags.MinLength<1>;
  level: SafetyLevelEnum;
  image_name: string & tags.MinLength<1>;
  created_time: string & tags.Format<'date-time'>;
  x: number;
  y: number;
}
