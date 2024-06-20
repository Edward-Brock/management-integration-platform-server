import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManageService {
  constructor(private prisma: PrismaService) {}

  async countTotalNumberUsers() {
    const result = await this.prisma.user.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    const countByStatus = [
      { name: 'ACTIVE', number: 0 },
      { name: 'SUSPENDED', number: 0 },
      { name: 'LOCKED', number: 0 },
      { name: 'INACTIVE', number: 0 },
      { name: 'TOTAL', number: 0 },
    ];

    const findIndexByName = (name: string) =>
      countByStatus.findIndex((item) => item.name === name);

    result.forEach((group) => {
      const statusIndex = findIndexByName(group.status.toUpperCase());
      if (statusIndex !== -1) {
        countByStatus[statusIndex].number = group._count.status;
        countByStatus[findIndexByName('TOTAL')].number += group._count.status;
      }
    });

    return countByStatus;
  }
}
