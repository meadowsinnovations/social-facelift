import { Injectable } from '@nestjs/common';
import { FaceliftResult } from './dto/facelift-result.dto';
import { RunFaceliftInput } from './dto/run-facelift.input';

@Injectable()
export class AnalysisService {
  async runFacelift(input: RunFaceliftInput): Promise<FaceliftResult> {
    return {
      profileId: input.profileId,
      summary: `Generated facelift recommendations for ${input.profileId}.`,
      nextStep: input.goals?.[0] ?? 'Review baseline metrics'
    };
  }
}
