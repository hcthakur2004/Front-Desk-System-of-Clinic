import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQueueDto, FilterQueueDto, UpdateQueueDto } from './dto/queue.dto';
import { QueueStatus } from './entities/queue.entity';
import { QueueService } from './queue.service';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.create(createQueueDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterQueueDto) {
    return this.queueService.findAll(filterDto);
  }

  @Get('today')
  getTodayQueue() {
    return this.queueService.getTodayQueue();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.update(id, updateQueueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(id);
  }

  @Patch(':id/status/waiting')
  markAsWaiting(@Param('id') id: string) {
    return this.queueService.updateStatus(id, QueueStatus.WAITING);
  }

  @Patch(':id/status/with-doctor')
  markAsWithDoctor(@Param('id') id: string) {
    return this.queueService.updateStatus(id, QueueStatus.WITH_DOCTOR);
  }

  @Patch(':id/status/completed')
  markAsCompleted(@Param('id') id: string) {
    return this.queueService.updateStatus(id, QueueStatus.COMPLETED);
  }

  @Patch(':id/status/canceled')
  markAsCanceled(@Param('id') id: string) {
    return this.queueService.updateStatus(id, QueueStatus.CANCELED);
  }
}