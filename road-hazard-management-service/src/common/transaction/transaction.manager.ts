import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { getNamespace } from 'cls-hooked';
import {
  TRANSACTION_ENTITY_MANAGER,
  TRANSACTION_NAMESPACE,
} from './transaction.middleware';

@Injectable()
export class TransactionManager {
  getEntityManager(): EntityManager {
    const nameSpace = getNamespace(TRANSACTION_NAMESPACE);
    if (!nameSpace || !nameSpace.active)
      throw new InternalServerErrorException(
        `${TRANSACTION_NAMESPACE} is not active`,
      );
    return nameSpace.get(TRANSACTION_ENTITY_MANAGER);
  }
}
