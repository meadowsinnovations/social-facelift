import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FaceliftResult {
  @Field()
  profileId!: string;

  @Field()
  summary!: string;

  @Field()
  nextStep!: string;
}
