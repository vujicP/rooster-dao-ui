// view single dao

import { Button, Buttons } from '../../src/ui/components/common';
import { CopyButton } from '../../src/ui/components/common/CopyButton';
import { Page } from './Page';
import { truncate } from '../../src/ui/util';
import { useDaos, useProposals } from '../lib/hooks';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { PlusSmIcon, TrashIcon } from '@heroicons/react/outline';

export function ViewDao() {
  const { address } = useParams();
  if (!address) throw new Error('No address in url');
  const navigate = useNavigate();
  const { getDao, forgetDao } = useDaos();
  const { getProposalsForDao } = useProposals();
  const dao = getDao(address);
  const proposals = getProposalsForDao(dao?.address);

  const forget = () => {
    forgetDao(dao);
    navigate('/explore');
  };

  return (
    <Page>
      <h3 className="inline pr-8 text-xl font-semibold dark:text-white text-gray-700 capitalize">
        {dao?.name}
      </h3>

      <div className="inline mt-4 dark:text-gray-400 text-gray-500 text-sm">
        <div className="inline-flex items-center">
          <span className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 py-1 font-mono rounded">
            {truncate(address, 4)}
          </span>
          <CopyButton className="ml-1" value={address} />
        </div>
      </div>

      <Button
        className="float-right border-2 dark:border-gray-700 border-gray-200"
        onClick={forget}
      >
        <TrashIcon className="w-4 dark:text-gray-500 mr-1 justify-self-end" />
        Forget DAO
      </Button>

      <Link
        to={`/dao/${address}/proposal/new`}
        className="flex mt-12 w-max justify-between items-center px-6 py-4 border text-gray-500 dark:border-gray-700 border-gray-200 rounded-md dark:bg-elevation-1 dark:hover:bg-elevation-2 hover:bg-gray-100"
      >
        <div className="flex items-center text-base dark:text-gray-300 text-gray-500 space-x-2">
          <PlusSmIcon className="h-8 w-8 dark:text-gray-500 text-gray-400 group-hover:text-gray-500" />
          <span>Create new proposal</span>
        </div>
      </Link>

      <h3 className="mt-12 text-xl font-semibold dark:text-white text-gray-700">Proposals</h3>

      <div className="mt-12 font-semibold grid grid-cols-6 w-full justify-items-center">
        <div className="col-span-3 justify-self-start">Description</div>
        <div className="col-span-1">For</div>
        <div className="col-span-1">Against</div>
        <div className="col-span-1">Abstain</div>
      </div>
      {proposals.map(proposal => (
        <div className="grid grid-cols-8 w-full justify-items-center">
          <div className="col-span-2 pt-3 justify-self-start dark:hover:text-gray-300 hover:text-gray-400">
            <Link to={`/dao/${address}/proposal/${proposal.id}`}> {proposal.description}</Link>
          </div>
          <div className="col-span-1 pt-3"></div>
          <div className="col-span-1 pt-3"></div>
          <div className="col-span-1 pt-3"></div>
        </div>
      ))}
    </Page>
  );
}