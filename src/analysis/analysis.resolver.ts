import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnalysisService } from './analysis.service';
import { FaceliftResult } from './dto/facelift-result.dto';
import { RunFaceliftInput } from './dto/run-facelift.input';

@Resolver(() => FaceliftResult)
export class AnalysisResolver {
  constructor(private readonly analysisService: AnalysisService) {}

  @Mutation(() => FaceliftResult, { name: 'runFacelift' })
  runFacelift(@Args('input') input: RunFaceliftInput): Promise<FaceliftResult> {
    return this.analysisService.runFacelift(input);
  }
}
