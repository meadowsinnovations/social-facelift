import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field()
  id!: string;

  @Field()
  displayName!: string;

  @Field()
  primaryPlatform!: string;
}
