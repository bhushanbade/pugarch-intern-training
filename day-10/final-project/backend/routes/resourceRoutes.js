import { Router } from 'express';
import { createResourceController } from '../controllers/resourceController.js';
import { createResourceService } from '../services/resourceService.js';

export function createResourceRouter(pool, resource) {
  const router = Router();
  const controller = createResourceController(resource, createResourceService(pool, resource));
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.patch);
  router.delete('/:id', controller.remove);
  return router;
}
