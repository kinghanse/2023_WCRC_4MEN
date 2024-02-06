import { ProcessFlagEnum } from 'src/common/constants';
import { tags } from 'typia';

export interface IActionableTask {
  id: string & tags.Format<'uuid'>;
  avg_point_x: number;
  avg_point_y: number;
  category: string & tags.MinLength<1>;
  event_cnt: number;
  created_time: string & tags.Format<'date-time'>;
  updateed_time: string & tags.Format<'date-time'>;
  process_flag: ProcessFlagEnum;
  version: null | (string & tags.MinLength<1>);
}
