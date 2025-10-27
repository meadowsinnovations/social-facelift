import { Body, Controller, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { FaceliftResult } from './dto/facelift-result.dto';
import { RunFaceliftInput } from './dto/run-facelift.input';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('run-facelift')
  runFacelift(@Body() input: RunFaceliftInput): Promise<FaceliftResult> {
    return this.analysisService.runFacelift(input);
  }
}
