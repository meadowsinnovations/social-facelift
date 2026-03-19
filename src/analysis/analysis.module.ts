import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisResolver } from './analysis.resolver';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService, AnalysisResolver]
})
export class AnalysisModule {}
