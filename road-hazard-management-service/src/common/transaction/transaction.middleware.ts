import { EntityManager } from 'typeorm';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { createNamespace, getNamespace } from 'cls-hooked';

export const TRANSACTION_NAMESPACE = 'TRANSACTION_NAMESPACE';
export const TRANSACTION_ENTITY_MANAGER = 'TRANSACTION_ENTITY_MANAGER';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly entityManager: EntityManager) {}
  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(TRANSACTION_NAMESPACE) ??
      createNamespace(TRANSACTION_NAMESPACE);
    return namespace.runAndReturn(async () => {
      Promise.resolve()
        .then(() => this.setEntityManager())
        .then(next);
    });
  }

  private setEntityManager() {
    const namespace = getNamespace(TRANSACTION_NAMESPACE)!;
    namespace.set(TRANSACTION_ENTITY_MANAGER, this.entityManager);
  }
}
