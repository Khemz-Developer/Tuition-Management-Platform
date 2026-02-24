import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Public } from '../decorators/public.decorator';

@Public()
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  async checkHealth() {
    const dbState = this.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const isConnected = dbState === 1;
    const dbName = this.connection.db?.databaseName || 'unknown';

    return {
      status: isConnected ? 'healthy' : 'unhealthy',
      database: {
        name: dbName,
        state: states[dbState] || 'unknown',
        connected: isConnected,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db')
  async checkDatabase() {
    try {
      const dbState = this.connection.readyState;
      const isConnected = dbState === 1;

      if (!isConnected) {
        return {
          connected: false,
          message: 'MongoDB is not connected',
          state: dbState,
        };
      }

      // Try to ping the database
      await this.connection.db.admin().ping();

      return {
        connected: true,
        database: this.connection.db.databaseName,
        message: 'MongoDB connection is active',
        collections: await this.connection.db.listCollections().toArray(),
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
      };
    }
  }
}
