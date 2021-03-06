import { Site, ArmObj } from '../../models/WebAppModels';

// tslint:disable-next-line:interface-name
export interface ScenarioCheckInput {
  site?: ArmObj<Site>;
}

export type ScenarioStatus = 'enabled' | 'disabled' | null;

// tslint:disable-next-line:interface-name
export interface ScenarioResult {
  status: ScenarioStatus;
  data?: any;
}

// tslint:disable-next-line:interface-name
export interface ScenarioCheckResult extends ScenarioResult {
  id?: string;
  environmentName?: string;
}

// tslint:disable-next-line:interface-name
interface ScenarioCheck {
  id: string;
  runCheck?: (input?: ScenarioCheckInput) => ScenarioResult;
  runCheckAsync?: (input?: ScenarioCheckInput) => Promise<ScenarioResult>;
}

export abstract class Environment {
  public scenarioChecks: { [key: string]: ScenarioCheck } = {};

  public abstract name: string;
  public abstract isCurrentEnvironment(input?: ScenarioCheckInput): boolean;
}
