import { InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { getNamespace } from 'cls-hooked';
import {
  TRANSACTION_ENTITY_MANAGER,
  TRANSACTION_NAMESPACE,
} from './transaction.middleware';

export function Transactional() {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const originMethod = descriptor.value;

    async function transactionWrapped(...args: unknown[]) {
      const nameSpace = getNamespace(TRANSACTION_NAMESPACE);

      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${TRANSACTION_NAMESPACE} is not active`,
        );

      const entityManager = nameSpace.get(
        TRANSACTION_ENTITY_MANAGER,
      ) as EntityManager;
      if (!entityManager)
        throw new InternalServerErrorException(
          `Could not find EntityManager in ${TRANSACTION_NAMESPACE} nameSpace`,
        );

      return await entityManager.transaction(async (tem: EntityManager) => {
        nameSpace.set(TRANSACTION_ENTITY_MANAGER, tem);
        return await originMethod.apply(this, args);
      });
    }

    descriptor.value = transactionWrapped;
  };
}
