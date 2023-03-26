import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder('game')
      .where("LOWER(game.title) LIKE :title", { title: `%${param.toLowerCase()}%` })
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // return await this.repository
    //   .createQueryBuilder("game")
    //   .innerJoinAndMapMany("game.users", "game.users", "user")      
    //   .where("game.id = :id", { id: id })
    //   .getRawMany()
      // Complete usando query builder
    return await this.repository
      .createQueryBuilder("game")
      .select('user.first_name as first_name, user.email as email, user.last_name as last_name')
      .where("game.id = :id", { id: id })
      .leftJoin('game.users', 'user')
      .getRawMany()
  }
}
