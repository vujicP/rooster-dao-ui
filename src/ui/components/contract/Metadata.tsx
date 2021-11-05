// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { MessageDocs } from './MessageDocs';
import { Abi } from 'types';

interface Props {
  abi?: Abi;
}
export const MetadataTab = ({ abi }: Props) => {
  if (!abi) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        {abi.constructors.concat(abi.messages).map(message => (
          <MessageDocs key={message.identifier} message={message} />
        ))}
      </div>
    </div>
  );
};