// Add DAO Form

import { BN as BNType } from '../../src/types';
import { Button, Buttons } from '../../src/ui/components/common';
import { Dropdown } from '../../src/ui/components';
import { ErrorBoundary } from './ErrorBoundary';
import { governorCodeHash } from '../lib/settings';
import { Input, InputNumber, Form, FormField, getValidation } from '../../src/ui/components/form';
import { instantiateDAO } from '../lib/api';
import { Page } from './Page';
import { useApi } from '../../src/ui/contexts';
import { useAccountId, useFormField } from '../../src/ui/hooks';
import { useState } from 'react';
import BN from 'bn.js';

const templateOptions = [
  { label: 'Rooster DAO', value: 'rooster' },
  { label: 'Custom', value: 'custom' },
];

enum units {
  seconds,
  minutes,
  hours,
  days,
  weeks,
  months,
}

const unitLabels = {
  [units.seconds]: 'Second(s)',
  [units.minutes]: 'Minute(s)',
  [units.hours]: 'Hour(s)',
  [units.days]: 'Day(s)',
  [units.weeks]: 'Week(s)',
  [units.months]: 'Month(s)',
};

const unitsAsArray = Object.keys(units);
const timeUnitOptions = unitsAsArray.slice(0, unitsAsArray.length / 2).map(x => ({
  label: unitLabels[x],
  value: Number(x),
}));

const resolveUnit = (value: BNType, unit) => {
  let resolvedValue = value.mul(new BN(1000));

  if (unit === units.seconds) return resolvedValue;
  resolvedValue = resolvedValue.mul(new BN(60));

  if (unit === units.minutes) return resolvedValue;
  resolvedValue = resolvedValue.mul(new BN(60));

  if (unit === units.hours) return resolvedValue;
  resolvedValue = resolvedValue.mul(new BN(24));

  if (unit === units.days) return resolvedValue;
  resolvedValue = resolvedValue.mul(new BN(7));

  if (unit === units.weeks) return resolvedValue;
  return resolvedValue.mul(new BN(4));
};

export function Add() {
  const [template, setTemplate] = useState(templateOptions[0].value);
  const [codeHash, setCodeHash] = useState('');
  const [votingDelay, setVotingDelay] = useState(new BN(0));
  const [unitVotingDelay, setUnitVotingDelay] = useState(units.hours);
  const [votingPeriod, setVotingPeriod] = useState(new BN(1));
  const [unitPeriod, setUnitPeriod] = useState(units.days);
  const [executionDelay, setExecutionDelay] = useState(new BN(0));
  const [unitExecution, setUnitExecution] = useState(units.hours);

  const { api, keyring } = useApi();
  const { value: accountId, onChange: setAccountId, ...accountIdValidation } = useAccountId();

  const daoName = useFormField<string>('My Rooster DAO', value => {
    if (!!value) {
      return { isValid: true };
    }
    return { isValid: false, isError: true, message: 'Please define a DAO name.' };
  });

  const createDAO = () => {
    if (daoName === '') return;
    const args = {
      name: daoName,
      votingDelay: resolveUnit(votingDelay, unitVotingDelay),
      votingPeriod: resolveUnit(votingPeriod, unitPeriod),
      executionDelay: resolveUnit(executionDelay, unitExecution),
    };
    instantiateDAO({
      api,
      keyring,
      accountId,
      codeHash: template === 'rooster' ? governorCodeHash : codeHash,
      args,
    });
  };

  return (
    <ErrorBoundary>
      <Page>
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-8 lg:col-span-8 2xl:col-span-8 rounded-lg w-full">
            <Form>
              <FormField
                className="mt-4"
                help=""
                id="labelDAOTemplate"
                label="Which DAO template do you want to use?"
                isError={false}
                message={''}
              >
                <Dropdown
                  onChange={x => setTemplate(x)}
                  options={templateOptions}
                  value={template}
                />
              </FormField>
              {template === templateOptions[1].value && (
                <FormField
                  help=""
                  id="labelCodeHash"
                  label="TBD: Enter code hash of custom DAO template"
                  isError={false}
                  message={'Please enter a valid code hash to continue.'}
                >
                  <Input
                    isDisabled={false}
                    placeholder="Enter code hash here"
                    onChange={value => setCodeHash(value)}
                    onFocus={e => e.target.select()}
                    type="text"
                    value={codeHash}
                  />
                </FormField>
              )}

              <FormField
                help=""
                id="labelName"
                label="What is the name of your DAO?"
                isError={false}
                {...getValidation(daoName)}
              >
                <Input
                  isDisabled={false}
                  placeholder="My Rooster DAO"
                  onFocus={e => e.target.select()}
                  type="text"
                  {...daoName}
                />
              </FormField>

              <FormField
                help=""
                id="labelVotingPeriod"
                label="How long is a proposal open for votings?"
                isError={false}
                message={''}
                className="grid grid-cols-4 gap-5"
                labelClass="col-span-2"
              >
                <InputNumber
                  value={votingPeriod}
                  isDisabled={false}
                  onChange={value => setVotingPeriod(value)}
                  placeholder="0"
                  className="col-start-3"
                />
                <Dropdown
                  onChange={x => setUnitPeriod(x)}
                  options={timeUnitOptions}
                  value={unitPeriod}
                />
              </FormField>

              <FormField
                help="Only after this delay DAO members can start to vote on the proposal."
                id="labelVotingDelay"
                label="Do you want a voting delay at the start of a proposal?"
                isError={false}
                message={''}
                className="grid grid-cols-4 gap-5"
                labelClass="col-span-2"
              >
                <InputNumber
                  value={votingDelay}
                  isDisabled={false}
                  onChange={value => setVotingDelay(value)}
                  placeholder="0"
                  className="col-start-3"
                />
                <Dropdown
                  onChange={x => setUnitVotingDelay(x)}
                  options={timeUnitOptions}
                  value={unitVotingDelay}
                />
              </FormField>

              <FormField
                help=""
                id="labelExecutionDelay"
                label="Do you want an execution delay after a proposal is accepted?"
                isError={false}
                message={''}
                className="grid grid-cols-4 gap-5"
                labelClass="col-span-2"
              >
                <InputNumber
                  value={executionDelay}
                  isDisabled={false}
                  onChange={value => setExecutionDelay(value)}
                  placeholder="0"
                  className="col-start-3"
                />
                <Dropdown
                  onChange={x => setUnitExecution(x)}
                  options={timeUnitOptions}
                  value={unitExecution}
                />
              </FormField>
              <FormField></FormField>
              <FormField></FormField>
              <Buttons>
                <Button variant="primary" isDisabled={false} onClick={createDAO}>
                  Create DAO
                </Button>
              </Buttons>
            </Form>
          </div>
        </div>
      </Page>
    </ErrorBoundary>
  );
}
