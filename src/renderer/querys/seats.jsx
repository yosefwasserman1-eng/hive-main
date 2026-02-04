/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import new_api from '../new_api/new_api';

export function useSeatsData() {
  const { map_name, project_name } = useParams();
  return useQuery(['seats', { map_name, project_name }], new_api.seats.get);
}
export function useSeatsDataScore() {
  const { map_name, project_name } = useParams();
  return useQuery(
    ['seats', { map_name, project_name }],
    new_api.seats.get_score
  );
}
export function useSeatsDataAll() {
  const { project_name } = useParams();
  return useQuery(['seats_all', { project_name }], new_api.seats.get_all);
}
export function useSeatsCreate() {
  const { map_name, project_name } = useParams();
  const hiveSocket = useSocket();
  const mutation = useMutation(
    (seats) => {
      const seatsString = JSON.stringify(seats);
      return new_api.seats.create(map_name, project_name, seatsString);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}
export function useSeatsDelete() {
  const { map_name, project_name } = useParams();
  const hiveSocket = useSocket();
  const mutation = useMutation(
    (seats_ids) => {
      const seatsIdsString = JSON.stringify(seats_ids);
      return new_api.seats.delete(seatsIdsString);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );

  return mutation.mutate;
}
export function useSeatsUpdate() {
  const { map_name, project_name } = useParams();
  const queryClient = useQueryClient();

  const nambers_mutation = useMutation(
    ({ data }) => {
      const dataString = JSON.stringify(data);
      return new_api.seats.update.numbers(dataString);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['seats', { map_name, project_name }]);
      },
    }
  );

  return {
    numbers: nambers_mutation.mutate,
  };
}
