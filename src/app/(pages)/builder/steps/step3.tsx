import React from 'react'
import * as Card from "~/components/ui/card";
import {Heading} from "~/components/ui/heading";
import {Input} from "~/components/ui/input";

type Props = {
  onChange: (value: string) => void;
}

function Step3({ onChange }: Props) {

  return (
    <>
      <Card.Header>
        <Card.Title>Create Repo</Card.Title>
      </Card.Header>
      <Card.Body>
        <Heading>Repo Name</Heading>
        <Input
          placeholder="Enter your repo name"
          onChange={(e) => onChange(e.target.value)}
        />
      </Card.Body>
    </>
  );
}

export default Step3