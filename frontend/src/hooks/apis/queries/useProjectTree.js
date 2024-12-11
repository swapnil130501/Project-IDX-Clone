import { useQuery } from '@tanstack/react-query';
import { getProjectTree } from '../../../apis/projects';

export default function useProjectTree(projectId) {
    const {isLoading, isError, data, error} = useQuery({
        queryFn: () => getProjectTree(projectId),
    });

    return {
        isLoading,
        isError,
        data,
        error,
    };
}