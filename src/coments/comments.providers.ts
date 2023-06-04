import { Comments } from './entity/comments.entity';

export const comentsProvider = [{
  provide:'COMMENTS_REPOSITORY', //This will be a constant in the future
  useValue:Comments,
}];