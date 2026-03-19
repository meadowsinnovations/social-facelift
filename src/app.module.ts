import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthBillingModule } from './auth-billing/auth-billing.module';
import { ProfileIntakeModule } from './profile-intake/profile-intake.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      playground: true
    }),
    AuthBillingModule,
    ProfileIntakeModule,
    AnalysisModule
  ]
})
export class AppModule {}
