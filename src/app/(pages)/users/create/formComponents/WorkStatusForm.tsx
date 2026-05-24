import { useFormContext } from 'react-hook-form';
import {
  translateEducationLevel,
  translateWorkStatus,
} from '@/app/(pages)/users/create/utils';
import FormInput from '@/components/organisms/form/formInput/FormInput';
import FormSelect from '@/components/organisms/form/formSelect/FormSelect';
import { EducationLevel, WorkStatus } from '@/server/db/schema';

export type WorkStatusFormProps = {
  workStatus: {
    status: WorkStatus;
    educationLevel: EducationLevel;
    profession?: string;
    institution?: string;
  };
};

const WorkStatusForm = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormSelect
          id="status"
          label="Status*"
          {...register('workStatus.status')}
        >
          {Object.entries(WorkStatus).map(([key, value]) => {
            return (
              <option key={key} value={value}>
                {translateWorkStatus(value)}
              </option>
            );
          })}
        </FormSelect>

        <FormSelect
          id="educationLevel"
          label="Stupanj obrazovanja*"
          {...register('workStatus.educationLevel')}
        >
          {Object.entries(EducationLevel).map(([key, value]) => {
            return (
              <option key={key} value={value}>
                {translateEducationLevel(value)}
              </option>
            );
          })}
        </FormSelect>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          id="profession"
          label="Zanimanje"
          {...register('workStatus.profession')}
        />

        <FormInput
          id="institution"
          label="Zvanje"
          {...register('workStatus.institution')}
        />
      </div>
    </div>
  );
};

export default WorkStatusForm;
